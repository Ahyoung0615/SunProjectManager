import React, { useState } from 'react';
import CoWorkComponent from './CoWorkComponent';
import CoWorkDetailComponent from './CoWorkDetailComponent';
import { Link } from 'react-router-dom';

const CoWorkListComponent = () => {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedCowCode, setSelectedCowCode] = useState('');

    const handleOpenDetail = (cowCode) => {
        setSelectedCowCode(cowCode);
        setOpenDetail(true);
    }

    return (
        <div style={{ marginTop: 50 }}>
            <CoWorkComponent onSelectOne={handleOpenDetail} />
            <br /><br /><br />
            
            {openDetail && (
                <div style={{textAlign: 'center'}}>
                    <CoWorkDetailComponent cowCode={selectedCowCode} />
                    <br /><br /><br />
                </div>
            )}
            
            
            <div style={{textAlign: 'center'}}>
            <Link to='/coworkAdForm'>
                <button type="button" className="btn btn-primary" style={{marginBottom: 50 }}>
                    신규 등록 
                </button>
                
            </Link>
            </div> 
        </div>
    );
};

export default CoWorkListComponent;
