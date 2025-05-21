
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

/**
 * A typed version of `useDispatch`
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * A typed version of `useSelector`
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */
export const useAppSelector = useSelector.withTypes<RootState>();