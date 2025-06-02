import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from "react-router";
import { Link } from "react-router-dom";

import { createDsfrCustomBrandingProvider, createMuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { Container, createTheme, GlobalStyles } from '@mui/material';
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
startReactDsfr({ defaultColorScheme: "light", Link });

import Home from './pages/home/Home';
import Terms from './pages/terms/Terms';

import { Header } from './components/header/Header';
import { Draw } from './pages/draw/Draw';

const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({
});

const { DsfrCustomBrandingProvider } = createDsfrCustomBrandingProvider({
  createMuiTheme: () => {

    const theme = createTheme({
      palette: {
        primary: {
          main: '#000091', // Content-Brand-1-Accent
        },
        secondary: {
          main: '#000000', // Content-Brand-1
          light: '#595959', // Content-Brand-1-Disabled
        },
        text: {
          primary: '#000091', // Content-Brand-1-Accent
          secondary: '#000000', // Content-Brand-1
          disabled: '#595959', // Content-Brand-1-Disabled
        },
      },
      typography: {
        fontFamily: '"Marianne", sans-serif',
        h4: {
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: '28px', // 127.273%
        },
      }
    });

    return { theme };
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiDsfrThemeProvider>
      <DsfrCustomBrandingProvider>
        <BrowserRouter>
          <GlobalStyles
            styles={{
              html: {
                scrollBehavior: "smooth"
              },
              body: {
                backgroundColor: "#f8f8f8"
              },
              ".lasuite-gaufre-btn": {
                boxShadow: "0px 0px 0px 0px inset !important"
              },
            }}
          />
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <Container
              sx={{
                marginY: "18px",
              }}>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/draw" element={<Draw />} />
              </Routes>
            </Container>
          </div>
        </BrowserRouter>
      </DsfrCustomBrandingProvider>
    </MuiDsfrThemeProvider>
  </StrictMode>,
)
