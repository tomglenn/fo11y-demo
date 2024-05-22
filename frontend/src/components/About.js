import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

function About() {
    return (
        <div>
            <h1>About</h1>
            <p>This app was built with <FontAwesomeIcon icon={faHeart} /> by <a href="https://www.codewithtom.com">Tom Glenn</a>.</p>
        </div>
    );
}

export default About;