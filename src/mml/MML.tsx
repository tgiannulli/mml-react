import React, { useState, useMemo, useCallback, FC, ComponentType, FormEvent } from 'react';

import { Parse, ConvertorType } from '../parser';
import { Loader as LoaderComponent, LoaderProps } from '../components/Loader';
import { Error as ErrorComponent, ErrorProps } from '../components/Error';
import { Success as SuccessComponent, SuccessProps } from '../components/Success';

export type MMLProps = {
  /** The MML string source to render */
  source: string;
  /** The convert config allows you to overwrite the MML to react conversion */
  converters?: Record<string, ConvertorType>;
  /** The submit callback whenever a form is submitted, submit is expected to return a promise */
  onSubmit?: (data: Record<string, unknown>) => Promise<any>;
  /** Custom classname, appended to wrapper classname */
  className?: string;
  /** The Loader component */
  Loader?: ComponentType<LoaderProps>;
  /** The error component */
  Error?: ComponentType<ErrorProps>;
  /** The success message component */
  Success?: ComponentType<SuccessProps>;
};

/**
 * MML root component
 */
export const MML: FC<MMLProps> = ({
  source,
  onSubmit,
  converters,
  className = '',
  Loader = LoaderComponent,
  Error = ErrorComponent,
  Success = SuccessComponent,
}) => {
  const [error, setError] = useState('');
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' });

  const tree = useMemo(() => {
    try {
      return Parse(source, converters);
    } catch (e) {
      console.warn('mml parsing error: ', source, e);
      setError("This chat message has invalid formatting and can't be shown");
      return null;
    }
  }, [source, converters]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const state: Record<string, any> = {};
      new FormData(event.currentTarget).forEach((value, key) => (state[key] = value));

      // include mml_name in the data
      if (tree?.name) state.mml_name = tree.name;

      // include clicked button value in the callback
      const button = document.activeElement as HTMLButtonElement;
      if (button && button.type === 'submit' && button.name && button.value) {
        state[button.name] = button.value;
      }

      if (!onSubmit) return console.warn('Forgot to pass onSubmit prop to <MML/>? payload:', state);

      try {
        setSubmitState({ loading: true, error: '', success: '' });
        await onSubmit(state);
        setSubmitState({ loading: false, error: '', success: 'submitted' });
      } catch (e) {
        setSubmitState({ loading: false, error: 'something is broken', success: '' });
      }
    },
    [onSubmit, tree],
  );

  const innerClassName = tree?.type === 'card' ? 'mml-card' : 'mml-wrap';

  return (
    <div className={`mml-container ${className}`}>
      {error ? (
        <div className={innerClassName}>
          <Error error={error} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={innerClassName}>
          {tree?.reactElements}
          {submitState.loading && <Loader loading={submitState.loading} />}
          {submitState.success && <Success success={submitState.success} />}
          {submitState.error && <Error error={submitState.error} />}
        </form>
      )}
    </div>
  );
};
