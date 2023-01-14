
export interface ITemplateVariable {
	[key: string]: string	|	number;

}

export interface IParseMailTemplate{
	file: string;
	variables: ITemplateVariable;
}

export interface IMailContact {
	name: string;
	email: string;
}

export interface ISendMail{
	to: IMailContact;
  from?: IMailContact;
	subject: string;
	template_data: IParseMailTemplate;
}
