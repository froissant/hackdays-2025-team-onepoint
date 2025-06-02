import { Container } from "@mui/material";
import { Link } from "react-router";

function Home() {
    return (
        <>
            <Container>
                Check the <Link to="/terms">Terms of Service</Link>
            </Container>
        </>
    )
}

export default Home;
