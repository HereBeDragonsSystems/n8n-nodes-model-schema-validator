export const SchemaTemplate = `

import {
  date,
  email,
  eq,
  max,
  min,
  minlength,
  password,
  url,
  Model,
  model,
  ModelArg,
  required
} from '@decaf-ts/decorator-validation';

@model()
export class CategoryModel extends Model {

  @required()
  name!: string;

	@required()
	@minlength(5)
  description!: string;

  constructor(args: ModelArg<CategoryModel> = {}) {
    super(args);
  }
}

@model()
export class ForAngularModel extends Model {

	@required()
  @min(1)
  @max(100)
  id!: number;

  @required()
  name!: string;

  category!: CategoryModel;

  @required()
  @date('yyyy-MM-dd')
  birthdate!: Date;

  @required()
  @email()
  email!: string;

  @url()
  website!: string;

  @required()
  @password()
  @eq("user.passwordRepeat")
  password!: string;

  @required()
  user!: UserModel;

  constructor(arg?: ModelArg<ForAngularModel>) {
    super(arg);
  }
}
`;
