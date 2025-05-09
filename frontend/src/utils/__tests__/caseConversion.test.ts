// @ts-nocheck

import { camelToSnake, snakeToCamel, objectToCamelCase, objectToSnakeCase } from '../caseConversion';

describe('caseConversion utilities', () => {
  test('camelToSnake converts camelCase to snake_case', () => {
    expect(camelToSnake('helloWorld')).toBe('hello_world');
    expect(camelToSnake('camelCaseTest')).toBe('camel_case_test');
    expect(camelToSnake('already_snake')).toBe('already_snake');
  });

  test('snakeToCamel converts snake_case to camelCase', () => {
    expect(snakeToCamel('hello_world')).toBe('helloWorld');
    expect(snakeToCamel('snake_case_test')).toBe('snakeCaseTest');
    expect(snakeToCamel('alreadyCamel')).toBe('alreadyCamel');
  });

  test('objectToCamelCase converts object keys recursively', () => {
    const snakeObj = {
      some_key: 'value',
      nested_obj: { inner_key: 1 },
      arr: [{ nested_arr_key: true }]
    };
    const camelObj = objectToCamelCase<typeof snakeObj>(snakeObj);
    expect(camelObj).toEqual({ someKey: 'value', nestedObj: { innerKey: 1 }, arr: [{ nestedArrKey: true }] });
  });

  test('objectToSnakeCase converts object keys recursively', () => {
    const camelObj = {
      someKey: 'value',
      nestedObj: { innerKey: 1 },
      arr: [{ nestedArrKey: true }]
    };
    const snakeObj = objectToSnakeCase<typeof camelObj>(camelObj);
    expect(snakeObj).toEqual({ some_key: 'value', nested_obj: { inner_key: 1 }, arr: [{ nested_arr_key: true }] });
  });
}); 