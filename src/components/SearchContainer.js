// @flow
import React from "react";

class SearchContainer extends React.Component {
    state = {
        genre: '',
        location: '',
        format: '',
    }

    // need a util fn that creates dropdown for options

    render() {
        return (
            <div>
                I want ____ books about ____ in this format ____
            </div>
        )
    }

}

export default SearchContainer;