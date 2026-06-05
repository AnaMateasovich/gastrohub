import {
  Html, Head, Body, Container, Section,
  Text, Heading, Button, Hr
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="es">
    <Head />
    <Body style={{ backgroundColor: "#fdf6ec", fontFamily: "Georgia, serif" }}>
      <Container style={{ backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", margin: "40px auto" }}>
        {/* Header */}
        <Section style={{ backgroundColor: "#c8a96e", padding: "40px", textAlign: "center" }}>
          <Text style={{ fontSize: 36, margin: 0 }}>🌾🍞</Text>
          <Heading style={{ color: "#fff", margin: "12px 0 0" }}>Sabores Naturales Casilda</Heading>
          <Text style={{ color: "#f5ecd7", fontSize: 13 }}>Panadería saludable artesanal</Text>
        </Section>

        {/* Body */}
        <Section style={{ padding: "40px 48px" }}>
          <Heading as="h2" style={{ color: "#5c3d1e" }}>¡Hola, {name}! 👋</Heading>
          <Text style={{ color: "#6b4c2a", lineHeight: 1.8 }}>
            Nos alegra muchísimo tenerte acá. Acabás de unirte a una comunidad que cree
            que comer bien no significa resignar el placer.
          </Text>
          <Button href="https://tusitio.com" style={{ backgroundColor: "#c8a96e", borderRadius: 50, color: "#fff", padding: "14px 36px" }}>
            Ver el menú 🍞
          </Button>
        </Section>

        <Hr style={{ borderColor: "#f0e0c8" }} />

        {/* Footer */}
        <Section style={{ padding: "24px 48px", textAlign: "center" }}>
          <Text style={{ color: "#b8957a", fontSize: 12 }}>Con amor desde el horno 🔥</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);