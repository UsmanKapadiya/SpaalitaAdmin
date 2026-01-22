import React from 'react';
import Button from '../Button/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

/**
 * PageTitle component with optional right-side action/button
 * @param {string} title - Main page title
 * @param {string} subTitle - Subtitle/description
 * @param {boolean} button - Show right-side button
 * @param {string} buttonLabel - Button text
 * @param {function} onButtonClick - Button click handler
 */
const PageTitle = ({ title, subTitle, button, buttonLabel, onButtonClick, backButton, backButtonLabel, onBackButtonClick }) => (
    <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <h1 className="page-title">{title}</h1>
                {subTitle && <p className="page-subtitle">{subTitle}</p>}
            </div>

            <div className="news-actions">
                {backButton && (

                    <Button
                        variant='secondary'
                        type="button"
                        onClick={onBackButtonClick}
                    >
                        {backButtonLabel}
                    </Button>
                )}
                {button && (
                    <Button
                        className="btn-add"
                        type="button"
                        onClick={onButtonClick}
                    >
                        {backButton ? <EditIcon /> : <AddIcon />}
                        {buttonLabel}
                    </Button>
                )}
            </div>

        </div>
    </div>
);

export default PageTitle;
