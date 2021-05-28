import { useCallback, useRef, useState } from "react";

export default function useLatestState<T>(
	value: T,
	isProp: boolean = false
): [React.MutableRefObject<T>, (val: T) => void] {
	const _ref = useRef<T>(value);
	const [, setDummy] = useState<number>(0);

	const setValue = useCallback((newVal: T) => {
		if (!Object.is(_ref.current, newVal)) {
			_ref.current = newVal;
			setDummy((d) => d + 1);
		}
	}, []);

	if (isProp) {
		_ref.current = value;
		return [_ref, (val: T) => {}];
	}

	return [_ref, setValue];
}
