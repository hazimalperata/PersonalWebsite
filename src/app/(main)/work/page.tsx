import {
  Badge,
  Column,
  Heading,
  Meta,
  Row,
  Schema,
} from '@once-ui-system/core';
import { baseURL, about, person, work } from '@/resources';
import { Projects } from '@/components/work/Projects';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth minHeight="160" horizontal="center" marginBottom="32">
        <Heading marginBottom="s" variant="heading-strong-xl" align="center">
          {work.title}
        </Heading>

        <Row vertical="center" gap="16">
          <Badge
            id="en"
            icon="cv"
            padding="s"
            title="CV (English)"
            href="/Hazim_Alper_Ata-EN-CV.pdf"
          />
          <Badge
            id="tr"
            icon="cv"
            padding="s"
            title="CV (Türkçe)"
            href="/Hazim_Alper_Ata-TR-CV.pdf"
          />
        </Row>
      </Column>

      <Projects />
    </Column>
  );
}
