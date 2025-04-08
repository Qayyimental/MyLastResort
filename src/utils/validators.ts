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

function validateInput<T extends Record<string, any>>(data: T, requiredFields: (keyof T)[]): boolean {
    return requiredFields.every(field => !!data[field]);
}

function validateAmount(value: number): boolean {
    return typeof value === 'number' && !isNaN(value) && value > 0;
}

export {
    validateRequiredFields,
    validateNumber,
    validateDate,
    validateInput,
    validateAmount
};