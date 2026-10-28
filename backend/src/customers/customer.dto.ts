import { IsDateString, IsIn, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

// No customerNumber here: the system generates it, the RM never sends it.
export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name must not be blank' })
  @MaxLength(255)
  name: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateOfBirth must be in the format YYYY-MM-DD' })
  @IsDateString({ strict: true })
  dateOfBirth: string;

  @IsIn(['M', 'F'])
  gender: string;
}
