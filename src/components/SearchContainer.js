// @flow
import React from "react";

class SearchContainer extends React.Component {
    constructor(props) {
        super(props)
    }

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