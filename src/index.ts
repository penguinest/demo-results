import { get } from '@/http';
import { ApplicationError, ApplicationErrorCodes, effectiveResult, isErrorResult } from './results';

type Todo = {
  id: number;
  completed: boolean;
  description: string;
  user: number;
};

const fetchSuccessData = () => get<Todo>('todos/1')
const fetchFailData = () => get<Todo>('501/1')

const unExpectedCrash = () => effectiveResult(() => {
  throw new Error('Random error');
});

const controlledCrash = () => effectiveResult(() => {
  throw new ApplicationError(ApplicationErrorCodes.MISSING_REQUIRED_FIELDS, 'Missing required fields', { info: 'This is a detail' });
});

const main = async () => {
  //#region EXAMPLE 1
  const successData = await fetchSuccessData();
  if (isErrorResult(successData)) {
    console.log('🔴 successData\n', successData, '\n');
  } else {
    console.log('🟢 successData\n', successData.value, '\n');
  }
  //#endregion EXAMPLE 1


  //#region EXAMPLE 2
  const failData = await fetchFailData();
  if (isErrorResult(failData)) {
    // DO NOT print the error itself, but the error data
    const { errorCode, message, name, description, details } = failData;
    console.log('🔴 failData\n', { errorCode, message, name,  description, details }, '\n');
  } else {
    console.log('🟢 failData\n', failData.value, '\n');
  }
  //#endregion EXAMPLE 2

  //#region EXAMPLE 3
  const unExpectedCrashResult = await unExpectedCrash();
  console.log('🟢 unExpectedCrashResult\n', unExpectedCrashResult, '\n');
  //#endregion EXAMPLE 3

  //#region EXAMPLE 4
  const controlledCrashResult = await controlledCrash();
  console.log('🟢 controlledCrashResult\n', controlledCrashResult, '\n');
  //#endregion EXAMPLE 4
};

if (require.main === module) {
  main()
    .catch(error => {
      console.error(`❌ ${error}`);
      process.exit(1);
    });
}