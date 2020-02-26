// @flow
import React from 'react';

type Props = {}

type State = {
    isFetchingData: boolean,
}

class AppContainer extends React.Component<Props, State> {
    state: State = {
        isFetchingData: false,
    }

    render() {
        return (
            <div>
                {this.state.isFetchingData}
            </div>
        )
    }
}



export default AppContainer;