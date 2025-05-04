"use client"

import styled from "styled-components"
import { Flame } from "lucide-react"
import { motion } from "framer-motion"

const LogoContainer = styled(motion.div)`
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  z-index: 20;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
`

const LogoIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  svg {
    filter: drop-shadow(0 0 8px rgba(255, 115, 0, 0.6));
  }
`

const LogoText = styled(motion.div)`
  display: flex;
  flex-direction: column;
`

const MainTitle = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF7300;
  line-height: 1.2;
  margin: 0;
`

const Subtitle = styled(motion.span)`
  font-size: 0.75rem;
  color: #E5E7EB;
  line-height: 1;
`

const BoitataLogo = () => {
  return (
    <LogoContainer
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <LogoIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      >
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 8px rgba(255, 115, 0, 0.3))",
              "drop-shadow(0 0 12px rgba(255, 115, 0, 0.8))",
              "drop-shadow(0 0 8px rgba(255, 115, 0, 0.3))",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* <Flame size={32} color="#FF7300" /> */}
          <img
          src="https://github.com/hallwaytechgrupo/Boitata/raw/main/Planejamento/utils/boitataLogoT.png"
          alt="Boitata INPE logo"
          width={60}
          height={60}
        />
        </motion.div>
      </LogoIcon>
      <LogoText>
        <MainTitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          Boitatá
        </MainTitle>
        <Subtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
          Programa Queimadas INPE
        </Subtitle>
      </LogoText>
    </LogoContainer>
  )
}

export default BoitataLogo
