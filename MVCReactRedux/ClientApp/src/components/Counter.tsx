import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../store';
import * as CounterStore from '../slices/Counter'
import { Button, ButtonGroup } from 'reactstrap';

export default function Counter() {
    const count = useSelector((state: ApplicationState) => state.counter.count);
    const dispatch = useDispatch();
    console.log("Rendering");
    return (
        <React.Fragment>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p aria-live="polite">Current count: <strong>{count}</strong></p>

            <ButtonGroup>
                <Button outline color="primary" size="lg"
                    onClick={() => dispatch(CounterStore.increment(1))}>
                    Increment
                </Button>
                <Button outline color="primary" size="lg"
                    onClick={() => dispatch(CounterStore.decrement(1))}>
                    Decrement
                </Button>
            </ButtonGroup>
        </React.Fragment>
    );
}