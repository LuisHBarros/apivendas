import handlebars from 'handlebars';

interface ITemplateVariable {
	[key: string]: string	|	number;

}

interface IParseMailTemplate{
	template: string;
	variables: ITemplateVariable;
}
export class HandlebarsMailTemplate {
	public async parse({ template, variables }: IParseMailTemplate): Promise<string> {
		const parsedTemplate = handlebars.compile(template);
		return parsedTemplate(variables);
  }

}
