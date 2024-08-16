import React from 'react';
import { useParams } from 'react-router-dom';

const DocumentDetailComponent = () => {
    
    const { edocCode } = useParams();

    return (
        <div>
            eDcoCode: {edocCode}
            DocumentDetailComponent
        </div>
    );
};

export default DocumentDetailComponent;