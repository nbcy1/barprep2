import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * Define backend with ConstructFactory objects
 */
defineBackend({
  auth,
  data,
});
