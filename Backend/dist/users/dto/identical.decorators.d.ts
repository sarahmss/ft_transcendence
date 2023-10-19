import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare function Identical(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class IdenticalConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
}
