import { ZodSchema, ZodError } from 'zod';

interface ValidationError {
	message: string;
	errors: Record<string, string>[];
}

type ValidationResult<T> =
	| { isValid: true; data: T }
	| { isValid: false; error: ValidationError };

export class Validator<T> {
	private schema: ZodSchema<T>;

	constructor(schema: ZodSchema<T>) {
		this.schema = schema;
	}

	validate(data: unknown): ValidationResult<T> {
		try {
			const validatedData = this.schema.parse(data);
			return { isValid: true, data: validatedData };
		} catch (e) {
			if (e instanceof ZodError) {
				return {
					isValid: false,
					error: {
						message: 'Validation error',
						errors: e.errors.map(err => {
              const field = err.path.join('.');
              return { [field]: err.message };
            })
					}
				};
			}
			throw e;
		}
	}
}