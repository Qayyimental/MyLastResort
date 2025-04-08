function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }
    return true;
}

function validateNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
}

function validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export { validateRequiredFields, validateNumber, validateDate };