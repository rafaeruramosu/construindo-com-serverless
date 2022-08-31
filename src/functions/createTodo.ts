import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { document } from '../utils/dynamodbClient';

type CreateTODO = {
    title: string;
    deadline: string;
}

type Template = {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { user_id } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as CreateTODO;

    const id = uuid();
    
    const data: Template = {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toUTCString(),
    }
    
    await document.put({
        TableName: 'todos',
        Item: data
    }).promise();
    
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'To-do created successfully.',
            data
        }),
    };
};