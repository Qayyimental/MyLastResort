"""
Ollama Mistral integration module.
Handles interactions with the Ollama API to use the Mistral model for AI features.
"""
import requests
import json
import time
from loguru import logger
from concurrent.futures import ThreadPoolExecutor
from app.utils.config import get_config

class OllamaIntegration:
    """Interface for interacting with Ollama's Mistral model."""
    
    def __init__(self):
        """Initialize the Ollama integration with configuration."""
        self.config = get_config()
        self.ollama_config = self.config.get('ollama', {})
        self.host = self.ollama_config.get('host', 'http://localhost:11434')
        self.model = self.ollama_config.get('model', 'mistral')
        self.timeout = self.ollama_config.get('timeout', 60)
        self.max_tokens = self.ollama_config.get('max_tokens', 1024)
        
        # Validate the host URL
        if not self.host.startswith(('http://', 'https://')):
            self.host = f'http://{self.host}'
        
        logger.info(f"Ollama integration initialized with model: {self.model}")
    
    def generate_text(self, prompt, system_prompt=None, max_tokens=None, temperature=0.7, stream=False):
        """
        Generate text using the Mistral model.
        
        Args:
            prompt (str): The prompt for text generation
            system_prompt (str, optional): System prompt to guide the model
            max_tokens (int, optional): Maximum tokens to generate
            temperature (float, optional): Sampling temperature (0.0 to 1.0)
            stream (bool, optional): Whether to stream the results
            
        Returns:
            str or generator: The generated text or stream of text chunks
        """
        if max_tokens is None:
            max_tokens = self.max_tokens
        
        url = f"{self.host}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": stream,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            if stream:
                return self._stream_response(url, payload)
            else:
                response = requests.post(url, json=payload, timeout=self.timeout)
                response.raise_for_status()
                result = response.json()
                return result.get("response", "")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error generating text with Ollama: {e}")
            return f"Error: Failed to communicate with Ollama service. {str(e)}"
    
    def _stream_response(self, url, payload):
        """
        Stream the response from the Ollama API.
        
        Args:
            url (str): API endpoint URL
            payload (dict): Request payload
            
        Yields:
            str: Text chunks as they become available
        """
        try:
            with requests.post(url, json=payload, timeout=self.timeout, stream=True) as response:
                response.raise_for_status()
                for line in response.iter_lines():
                    if line:
                        try:
                            chunk = json.loads(line)
                            if 'response' in chunk:
                                yield chunk['response']
                            # Check if generation is complete
                            if chunk.get('done', False):
                                break
                        except json.JSONDecodeError:
                            logger.warning(f"Failed to decode JSON from stream: {line}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error streaming response from Ollama: {e}")
            yield f"Error: Failed to stream response from Ollama. {str(e)}"
    
    def extract_data_from_pdf(self, pdf_content):
        """
        Extract structured data from PDF content using the Mistral model.
        
        Args:
            pdf_content (bytes): Raw PDF content
            
        Returns:
            dict: Extracted structured data
        """
        import base64
        
        # Encode PDF content as base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Create prompt for PDF extraction
        prompt = """
        I have a financial document in PDF format (encoded as base64). Extract the following information:
        1. Document type (invoice, financial statement, receipt, etc.)
        2. Date(s) mentioned in the document
        3. Company or entity names
        4. Financial amounts and their descriptions
        5. Account details if present
        6. Any other relevant financial information
        
        Format the response as a structured JSON object.
        
        PDF content (base64): {pdf_base64}
        """.format(pdf_base64=pdf_base64[:100] + "..." if len(pdf_base64) > 100 else pdf_base64)
        
        system_prompt = "You are a financial document analysis assistant. Extract structured data from documents accurately and format it as JSON."
        
        # Get response from model
        response = self.generate_text(prompt, system_prompt, temperature=0.2)
        
        # Extract JSON from response
        try:
            # Look for JSON structure in the response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            else:
                # Try to parse the whole response as JSON
                return json.loads(response)
        except (json.JSONDecodeError, ValueError):
            logger.error("Failed to extract JSON from model response")
            
            # Fall back to a simplified extraction approach
            return self._fallback_extraction(response)
    
    def _fallback_extraction(self, text):
        """
        Fallback method to extract structured data when JSON parsing fails.
        
        Args:
            text (str): Text to parse
            
        Returns:
            dict: Extracted data in a simplified structure
        """
        import re
        
        result = {
            "document_type": "Unknown",
            "dates": [],
            "entities": [],
            "amounts": [],
            "accounts": [],
            "other_info": []
        }
        
        # Extract dates
        date_patterns = [
            r'\d{1,2}/\d{1,2}/\d{2,4}',
            r'\d{4}-\d{1,2}-\d{1,2}',
            r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}'
        ]
        
        for pattern in date_patterns:
            dates = re.findall(pattern, text, re.IGNORECASE)
            result["dates"].extend(dates)
        
        # Extract monetary amounts
        amount_pattern = r'[$€£¥]?\s?\d+(?:[.,]\d+)*(?:\.\d+)?'
        amounts = re.findall(amount_pattern, text)
        
        # Add context to amounts if available
        for amount in amounts:
            # Get words before and after the amount
            context_pattern = f"(.{{1,30}}){re.escape(amount)}(.{{1,30}})"
            contexts = re.findall(context_pattern, text)
            if contexts:
                before, after = contexts[0]
                result["amounts"].append({
                    "amount": amount,
                    "context": f"{before.strip()} {amount} {after.strip()}"
                })
            else:
                result["amounts"].append({
                    "amount": amount,
                    "context": ""
                })
        
        # Extract potential entities (company names)
        company_patterns = [
            r'(?:[A-Z][a-z]+ ){1,3}(?:LLC|Inc|Ltd|Corp|Corporation|Company)',
            r'(?:[A-Z][a-z]+ ){1,3}& (?:[A-Z][a-z]+ ){1,2}',
            r'(?:[A-Z][A-Za-z]+ ){1,2}(?:Bank|Financial|Insurance)'
        ]
        
        for pattern in company_patterns:
            companies = re.findall(pattern, text)
            result["entities"].extend(companies)
        
        # Extract account-like numbers
        account_pattern = r'(?:Account|Acct)[:\s#]+([A-Za-z0-9\-]+)'
        accounts = re.findall(account_pattern, text, re.IGNORECASE)
        result["accounts"].extend(accounts)
        
        # Determine document type based on keywords
        document_types = {
            "invoice": ["invoice", "bill", "payment due"],
            "receipt": ["receipt", "payment received", "thank you for your payment"],
            "statement": ["statement", "account summary", "balance"],
            "report": ["report", "analysis", "financial report"]
        }
        
        text_lower = text.lower()
        for doc_type, keywords in document_types.items():
            if any(keyword in text_lower for keyword in keywords):
                result["document_type"] = doc_type.capitalize()
                break
        
        return result
    
    def analyze_financial_data(self, data, analysis_type):
        """
        Analyze financial data using the Mistral model.
        
        Args:
            data (dict): Financial data to analyze
            analysis_type (str): Type of analysis to perform
            
        Returns:
            dict: Analysis results
        """
        if analysis_type == "anomaly_detection":
            return self._detect_anomalies(data)
        elif analysis_type == "trend_analysis":
            return self._analyze_trends(data)
        elif analysis_type == "recommendation":
            return self._generate_recommendations(data)
        else:
            logger.warning(f"Unsupported analysis type: {analysis_type}")
            return {"error": f"Unsupported analysis type: {analysis_type}"}
    
    def _detect_anomalies(self, data):
        """
        Detect anomalies in financial data.
        
        Args:
            data (dict): Financial data to analyze
            
        Returns:
            dict: Detected anomalies
        """
        # Convert data to a string representation for the model
        data_str = json.dumps(data, indent=2)
        
        prompt = f"""
        Analyze the following financial data to identify any anomalies, outliers, or suspicious patterns.
        Focus on unusual transactions, unexpected changes in financial metrics, or potential errors.
        For each identified anomaly, provide:
        1. The specific data point or pattern that is anomalous
        2. Why it is considered anomalous (statistical reason, business context, etc.)
        3. The potential impact of this anomaly
        4. Recommended actions to investigate or address it
        
        Financial data:
        {data_str}
        
        Format your response as JSON with an array of anomalies.
        """
        
        system_prompt = "You are a financial anomaly detection expert. Analyze data rigorously and identify genuine anomalies that warrant attention."
        
        response = self.generate_text(prompt, system_prompt, temperature=0.3)
        
        # Extract JSON from response
        try:
            json_start = response.find('[')
            json_end = response.rfind(']') + 1
            
            if json_start >= 0 and json_end > json_start:
                anomalies = json.loads(response[json_start:json_end])
                return {"anomalies": anomalies}
            else:
                # Try to parse full response
                return json.loads(response)
        except (json.JSONDecodeError, ValueError):
            logger.error("Failed to extract anomalies JSON from model response")
            return {
                "anomalies": [],
                "raw_analysis": response
            }
    
    def _analyze_trends(self, data):
        """
        Analyze trends in financial data.
        
        Args:
            data (dict): Financial data to analyze
            
        Returns:
            dict: Trend analysis results
        """
        # Convert data to a string representation for the model
        data_str = json.dumps(data, indent=2)
        
        prompt = f"""
        Analyze the following financial data to identify significant trends, patterns, and insights.
        Focus on:
        1. Growth or decline trends in key metrics
        2. Seasonal patterns or cyclical behavior
        3. Correlations between different financial indicators
        4. Comparative analysis against industry benchmarks or historical performance
        5. Key turning points or changes in trajectory
        
        Financial data:
        {data_str}
        
        Format your response as JSON with identified trends and supporting analysis.
        """
        
        system_prompt = "You are a financial trend analysis expert. Identify meaningful patterns in data and provide insightful analysis."
        
        response = self.generate_text(prompt, system_prompt, temperature=0.4)
        
        # Extract JSON from response
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                return json.loads(response[json_start:json_end])
            else:
                return json.loads(response)
        except (json.JSONDecodeError, ValueError):
            logger.error("Failed to extract trends JSON from model response")
            return {
                "trends": [],
                "raw_analysis": response
            }
    
    def _generate_recommendations(self, data):
        """
        Generate financial recommendations based on data.
        
        Args:
            data (dict): Financial data to analyze
            
        Returns:
            dict: Recommendations
        """
        # Convert data to a string representation for the model
        data_str = json.dumps(data, indent=2)
        
        prompt = f"""
        Based on the following financial data, provide strategic recommendations for improving financial performance.
        Consider:
        1. Cost optimization opportunities
        2. Revenue growth strategies
        3. Investment priorities
        4. Risk management approaches
        5. Cash flow optimization
        6. Working capital management
        
        For each recommendation, provide:
        - A clear actionable suggestion
        - The expected benefit
        - Implementation considerations
        - Metrics to track effectiveness
        
        Financial data:
        {data_str}
        
        Format your response as JSON with an array of recommendations.
        """
        
        system_prompt = "You are a strategic financial advisor. Provide practical, valuable recommendations based on sound financial principles."
        
        response = self.generate_text(prompt, system_prompt, temperature=0.5)
        
        # Extract JSON from response
        try:
            json_start = response.find('[')
            json_end = response.rfind(']') + 1
            
            if json_start >= 0 and json_end > json_start:
                recommendations = json.loads(response[json_start:json_end])
                return {"recommendations": recommendations}
            else:
                # Try to parse full response
                return json.loads(response)
        except (json.JSONDecodeError, ValueError):
            logger.error("Failed to extract recommendations JSON from model response")
            return {
                "recommendations": [],
                "raw_analysis": response
            }

def check_ollama_availability():
    """
    Check if Ollama service is available.
    
    Returns:
        bool: True if Ollama is available, False otherwise
    """
    config = get_config()
    host = config.get('ollama', {}).get('host', 'http://localhost:11434')
    
    # Validate the host URL
    if not host.startswith(('http://', 'https://')):
        host = f'http://{host}'
    
    url = f"{host}/api/tags"
    
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False