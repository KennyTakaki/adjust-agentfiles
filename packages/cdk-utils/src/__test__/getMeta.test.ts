import { getMeta } from '../meta-util';
import { Construct } from 'constructs';

describe('getMeta', () => {
  let mockScope: Construct;
  let tryGetContextMock: jest.Mock;

  beforeEach(() => {
    tryGetContextMock = jest.fn();
    mockScope = {
      node: { tryGetContext: tryGetContextMock },
    } as unknown as Construct;

    // 環境変数は毎回クリア
    process.env.STAGE = undefined;
    process.env.PROJECT = undefined;
    process.env.SERVICE = undefined;
  });

  it('context が優先される', () => {
    tryGetContextMock.mockImplementation((key: string) => {
      if (key === 'stage') return 'prod';
      if (key === 'project') return 'awesome';
      if (key === 'service') return 'api';
      return undefined;
    });

    const result = getMeta(mockScope);

    expect(result).toEqual({
      stage: 'prod',
      project: 'awesome',
      service: 'api',
    });
  });

  it('環境変数が使われる (context が undefined の場合)', () => {
    tryGetContextMock.mockReturnValue(undefined);

    process.env.STAGE = 'staging';
    process.env.PROJECT = 'envproject';
    process.env.SERVICE = 'envservice';

    const result = getMeta(mockScope);

    expect(result).toEqual({
      stage: 'staging',
      project: 'envproject',
      service: 'envservice',
    });
  });

  it('デフォルト値にフォールバックする (context と env 両方 undefined)', () => {
    tryGetContextMock.mockReturnValue(undefined);

    const result = getMeta(mockScope);

    expect(result).toEqual({
      stage: 'dev',
      project: 'myproject',
      service: 'web',
    });
  });

  it('一部だけ context があり、残りは環境変数やデフォルトが使われる', () => {
    tryGetContextMock.mockImplementation((key: string) => {
      if (key === 'project') return 'contextProject';
      return undefined;
    });

    process.env.STAGE = 'fromEnv';

    const result = getMeta(mockScope);

    expect(result).toEqual({
      stage: 'fromEnv', // env
      project: 'contextProject', // context
      service: 'web', // default
    });
  });
});
