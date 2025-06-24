import { motion } from "framer-motion"
import { LogoContainer, LogoIcon, LogoText, MainTitle, Subtitle } from '../../styles/styles'

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
