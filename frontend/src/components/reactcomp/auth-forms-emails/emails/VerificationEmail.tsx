import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { envServer } from '@/lib/env/env.server';
interface EmailProps {
  user?: {
    name: string;
    email: string;
  };
  newUrl?: string;
}
const baseUrl = envServer.PUBLIC_URL;

export const WelcomeEmail = ({ user, newUrl }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#007a55',
                offwhite: '#fafbfb',
              },
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Preview>Welcome</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Img
            src="https://refine-web.imgix.net/blog/2023-06-12-astro-js/social-2.png?w=1788"
            width="200"
            height="85"
            alt="AsrtoFastapi Logo"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">Welcome to AsrtoFastapi</Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations {user?.name} ! You're joining over 3 million people around the world
                  who use <strong>igorfastapi.co.uk</strong> to be part of community.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <Section className="text-center">
              <Button href={newUrl} className="bg-brand rounded-lg px-[18px] py-3 text-white">
                Verify your email address !
              </Button>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="px-20 text-center">
                  If the button not work, copy and paste this link into your browser:{' '}
                  <Link href={newUrl}>{newUrl}</Link>
                </Column>
              </Row>
            </Section>
            <Text className="mb-45 text-center text-gray-400">
              AsrtoFastapi, XX Some Street, Suite 300 Some City, Some State, 99999
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
