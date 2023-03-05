import { SortListPipe } from './sort-list.pipe';

describe('SortListPipe', () => {
  let pipe: SortListPipe;

  beforeEach(() => {
    pipe = new SortListPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sort an array of objects by a specified property', () => {
    const input = [{name: 'Bob', age: 35}, {name: 'Alice', age: 25}, {name: 'Charlie', age: 45}];
    const expectedOutput = [{name: 'Alice', age: 25}, {name: 'Bob', age: 35}, {name: 'Charlie', age: 45}];
    const actualOutput = pipe.transform(input, 'name');
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should return the original array if either parameter is falsy', () => {
    const input = [{name: 'Bob', age: 35}, {name: 'Alice', age: 25}, {name: 'Charlie', age: 45}];
    const expectedOutput = input;
    let actualOutput = pipe.transform(input, '');
    expect(actualOutput).toEqual(expectedOutput);
    actualOutput = pipe.transform([], 'name');
    expect(actualOutput).toEqual([]);
  });
});
