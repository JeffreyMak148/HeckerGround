import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { Link } from 'react-router-dom';
import "./Footer.css";

export const Footer = ({scrollToTop}: {scrollToTop: () => void}): JSX.Element => {

    return (
        <div className="footer">
            <div className="flex-display justify-content">
                <div className="footer-terms">
                    <Link to={`/terms-and-conditions`} className="footer-terms-link" onClick={scrollToTop}>
                        Terms and Conditions
                    </Link>
                </div>
                <div className="footer-privacy">
                    <Link to={`/privacy-policy`} className="footer-privacy-link" onClick={scrollToTop}>
                        Privacy Policy
                    </Link>
                </div>
            </div>
            <div className="flex-display footer-name justify-content">
                <div className="copyright-icon"><AiOutlineCopyrightCircle/></div>2024 Heckerground.com
            </div>
        </div>
    );
};
