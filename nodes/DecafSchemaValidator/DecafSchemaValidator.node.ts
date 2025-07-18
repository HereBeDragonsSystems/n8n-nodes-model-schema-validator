import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { SchemaTemplate } from './template';

export class DecafSchemaValidatorNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Decaf's Schema Validator",
		name: 'decafSchemaValidator',
		group: ['transform'],
		version: 1,
		description: 'Validates input according to a predefined schema',
		defaults: {
			name: 'Example Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Schema Definition (by Decaf)',
				name: 'definition',
				type: 'string',
				default: SchemaTemplate,
				description: 'The annotated definition of the schema (as per Decaf standards)',
			},
			{
				displayName: 'Exceptions',
				name: 'exceptions',
				type: 'string',
				default: '',
				placeholder: 'comma separated attributes to be ignored in the validation',
				description: 'The annotated definition of the schema (as per Decaf standards)',
			},
			{
				displayName: 'Data',
				name: 'definition',
				type: 'json',
				default: '',
				placeholder: '{{ $json }}',
				description: 'The data to be validated',
			},
			{
				displayName: 'Throw Error On Fail',
				name: 'definition',
				type: 'boolean',
				default: true,
				description:
					'Whether the validator throw a validation error, or open a connector to handle the error',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.myString = myString;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
