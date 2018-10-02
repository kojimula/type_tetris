import { hello } from '../src/main';

describe('hello', () => {
  it('hello("World") to be "Hello World!!"', () => {
    expect(hello('World')).toBe('Hello World!!');
  })
  it('hello("world") not to be "Hello Underworld!!"', () => {
    expect(hello('world')).not.toBe('Hello Underworld!!');
  });
});