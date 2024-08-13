import React from 'react';
import { useParams } from 'react-router-dom';

const FDeliveryNowDetailComponent = () => {
    const { fdelcode } = useParams();

    return (
        <div>
            <h2>운송 코드: {fdelcode}</h2>
        </div>
    );
};

export default FDeliveryNowDetailComponent;
