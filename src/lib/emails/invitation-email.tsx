import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

interface InvitationEmailProps {
  inviteUrl: string;
}

export function InvitationEmail({ inviteUrl }: InvitationEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Te invitaron a GastroHub</Heading>
          <Text>
            Recibiste una invitación para unirte a un equipo. Hacé click en
            el botón para crear tu cuenta.
          </Text>
          <Button href={inviteUrl}>Aceptar invitación</Button>
          <Text>Este link expira en 7 días.</Text>
        </Container>
      </Body>
    </Html>
  );
}