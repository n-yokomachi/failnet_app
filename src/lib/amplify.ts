import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import outputs from '../../amplify_outputs.json';

// Configure Amplify with sandbox outputs
Amplify.configure(outputs);

// Generate the GraphQL client
export const client = generateClient<Schema>();