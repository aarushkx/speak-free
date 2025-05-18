import { APP_NAME } from "@/lib/constants";
import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Hr,
} from "@react-email/components";

interface IVerificationEmailProps {
    username: string;
    otp: string;
    validity: string;
}

const VerificationEmail = ({
    username,
    otp,
    validity,
}: IVerificationEmailProps) => {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>{`Your ${APP_NAME} Verification Code`}</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>
                Your {APP_NAME} verification code: {otp} (Valid for {validity})
            </Preview>
            <Section style={container}>
                <Row style={header}>
                    <Heading as="h2" style={heading}>
                        Hello {username},
                    </Heading>
                </Row>

                <Row style={paragraph}>
                    <Text>
                        Thank you for registering with {APP_NAME}! To complete
                        your registration, please use the following one-time
                        verification code:
                    </Text>
                </Row>

                <Row style={codeContainer}>
                    <Text style={code}>{otp}</Text>
                </Row>

                <Row style={paragraph}>
                    <Text style={validityText}>
                        ⏳ This code will expire in {validity}.
                    </Text>
                </Row>

                <Row style={paragraph}>
                    <Text>
                        If you didn't request this code, please ignore this
                        e-mail.
                    </Text>
                </Row>

                <Hr style={divider} />

                <Row style={footer}>
                    <Text style={footerText}>
                        © {new Date().getFullYear()} {APP_NAME}. All rights
                        reserved.
                    </Text>
                </Row>
            </Section>
        </Html>
    );
};

const container = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    fontFamily: "Roboto, Verdana, sans-serif",
};

const header = {
    marginBottom: "24px",
};

const heading = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333333",
};

const paragraph = {
    margin: "16px 0",
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#555555",
};

const codeContainer = {
    background: "#f6f6f6",
    borderRadius: "4px",
    padding: "24px",
    margin: "24px 0",
    textAlign: "center" as const,
};

const code = {
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "4px",
    color: "#333333",
};

const validityText = {
    ...paragraph,
    color: "#e74c3c",
};

const divider = {
    border: "none",
    borderTop: "1px solid #eeeeee",
    margin: "24px 0",
};

const footer = {
    marginTop: "24px",
};

const footerText = {
    fontSize: "14px",
    color: "#999999",
    margin: "4px 0",
};

export default VerificationEmail;
