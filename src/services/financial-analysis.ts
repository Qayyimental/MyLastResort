import * as tf from '@tensorflow/tfjs';

export class FinancialAnalysisService {
  async calculateRatios(balanceSheet: any, incomeStatement: any) {
    return {
      currentRatio: balanceSheet.currentAssets / balanceSheet.currentLiabilities,
      quickRatio: (balanceSheet.currentAssets - balanceSheet.inventory) / balanceSheet.currentLiabilities,
      debtToEquity: balanceSheet.totalLiabilities / balanceSheet.totalEquity,
      returnOnAssets: incomeStatement.netIncome / balanceSheet.totalAssets,
      returnOnEquity: incomeStatement.netIncome / balanceSheet.totalEquity
    };
  }

  async predictFutureTrends(historicalData: number[]): Promise<number[]> {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    const xs = tf.tensor2d(historicalData.slice(0, -1), [historicalData.length - 1, 1]);
    const ys = tf.tensor2d(historicalData.slice(1), [historicalData.length - 1, 1]);

    await model.fit(xs, ys, { epochs: 100 });
    
    const lastValue = historicalData[historicalData.length - 1];
    const prediction = model.predict(tf.tensor2d([lastValue], [1, 1])) as tf.Tensor;
    
    return Array.from(prediction.dataSync());
  }
}
