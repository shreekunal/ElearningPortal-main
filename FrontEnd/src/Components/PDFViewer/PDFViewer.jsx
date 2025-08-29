import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PDFViewer.css'; // Import your custom CSS for further styling
import Loader from "../Loader/Loader.jsx";
import {CurrentUserContext} from "../../App.jsx";

const PdfViewer = ({document,name}) => {
    const { showMessage } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const route = useLocation();

    useEffect(() => {
        // Fetch the PDF URL from the backend
        const fetchPdf = async () => {
            try {
                const response = await fetch(`${document}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    showMessage("PDF Load Error, please try again", true);
                    navigate(`/AssignmentPage`, {state: {aid: route.state.aid}});
                }
                console.clear();
            } catch (error) {
                showMessage("Something went wrong, please try again", true);
                navigate(`/AssignmentPage`, {state: {aid: route.state.aid}});
                console.clear();
            }
        };

        fetchPdf();
    }, []);

    return (
        <div className="pdf-viewer-container"
             style={(route.state.submitMode || route.state.viewMode)? {minWidth: "50%"} : {}}>
            <div className="pdf-viewer-header">
                <h2>{name}</h2>
            </div>
            <div className="pdf-viewer-content" style={!document? {height: "200px"} : {}}>
                {
                    document? (
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                            <div className="pdf-viewer">
                                <Viewer fileUrl={document} />
                            </div>
                        </Worker>
                    ) : document === null? (
                        <div className="pdf-viewer-error">
                            <h3>PDF not found</h3>
                        </div>
                    ) : (
                        <Loader />
                    )
                }
            </div>
        </div>
    );
};

export default PdfViewer;
