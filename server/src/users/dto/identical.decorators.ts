import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

/*
    @brief: A custom decorator to validate if the value of a property is identica to the value of another property in the same class
        @param: property -> The property to which the current value will be compared
        @param: validationOptions -> Aditional validation options for the decorator
*/
export function Identical(property: string, validationOptions?: ValidationOptions)
{
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IdenticalConstraint,
        });
    }
}

/*
    @brief: Validation class that implements logic to check if two properties are equal
*/
@ValidatorConstraint({name: 'Identical'})
export class IdenticalConstraint implements ValidatorConstraintInterface {
       
    /*
        @brief: Validates if the value of the current property is equal to the value of the related property
            @param: value -> The value of the current property
            @param: args -> Validation arguments containing constraints and the object
        @ return: 'true' if the property values are equal, 'false' otherwise
    */
   validate(value: any, args: ValidationArguments){
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return  value === relatedValue;
   }

}

