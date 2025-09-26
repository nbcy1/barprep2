import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';  // keep if you have a data resource; else remove

defineBackend({
  auth,
  data,
});
