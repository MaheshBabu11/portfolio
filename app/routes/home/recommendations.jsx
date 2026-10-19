import advaithImage from '~/assets/recommendations/advaith.png';
import hazithaImage from '~/assets/recommendations/hazitha.webp';
import keerthanImage from '~/assets/recommendations/keerthan.jpeg';
import parakhImage from '~/assets/recommendations/parakh.jpeg';
import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { useState } from 'react';
import styles from './recommendations.module.css';

const recommendations = [
  {
    name: 'Kolaparthi Hazitha',
    image: hazithaImage,
    role: 'Senior Software Engineer at Capgemini',
    date: 'December 31, 2023',
    dateTime: '2023-12-31',
    relationship: 'Worked with Mahesh on the same team',
    quote:
      "I have had the opportunity of working with mahesh for two years. He is a talented person and works very hard. And also he's always curious about knowing and learning new technologies. He shares his knowledge with other team members as well. He was a nice co-worker and looking forward to work with him again.",
  },
  {
    name: 'Keerthan Dharmana',
    image: keerthanImage,
    role: 'Application Engineer at Swiss Re, Hyderabad',
    date: 'December 27, 2023',
    dateTime: '2023-12-27',
    relationship: 'Worked with Mahesh on the same team',
    quote:
      'I have had the opportunity of working with Mahesh for almost a span of 2 years. He has a very good command on Java, Oracle Database and other technologies too. He also had a very good grip on the functionalities that we developed in our project. Whenever I had any queries, I approach him and he always used to guide me the right direction.',
  },
  {
    name: 'Parakh Chaudhary',
    image: parakhImage,
    role: 'Software Developer',
    date: 'January 14, 2022',
    dateTime: '2022-01-14',
    relationship: 'Worked with Mahesh on different teams',
    quote:
      'Mahesh is an incredibly talented and curious individual who has an eye for detail. His drive to achieve perfection in his work has been a motivating factor for me throughout our journey in Capgemini. I look forward to working with him again and learning more.',
  },
  {
    name: 'Advaith Narayan',
    image: advaithImage,
    role: 'Senior Red Team Engineer @ H&R Block',
    date: 'January 14, 2022',
    dateTime: '2022-01-14',
    quote:
      'I have had the opportunity of knowing Mahesh Babu for the past. He is a detail oriented, goal oriented, ambitious and powerful co-worker, his knowledge is vast and thorough. I would recommend him with any project that requires the very best in coding. Whenever I had a problem, there has never been a time he has left me without a solution. On account of his mature approach to his responsibilities, I often thought of Mahesh Babu as a professional I could always rely upon to get the job done. Certainly worth recommending.',
  },
];

export function Recommendations() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Section
      as="section"
      id="recommendations"
      className={styles.section}
      aria-labelledby="recommendations-title"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <Divider className={styles.divider} notchWidth="64px" notchHeight="8px" />
            <Text className={styles.kicker} secondary size="s">
              Recommendations
            </Text>
          </div>
          <Heading className={styles.title} level={2} id="recommendations-title">
            What colleagues say
          </Heading>
        </header>
        <div className={styles.panels} role="region" aria-label="Colleague recommendations">
          {recommendations.map(
            ({ name, image, role, date, dateTime, relationship, quote }, index) => {
              const isActive = activeIndex === index;
              const tabId = `recommendation-tab-${index}`;
              const panelId = `recommendation-panel-${index}`;

              return (
                <article
                  className={styles.panel}
                  data-active={isActive}
                  key={name}
                >
                  <button
                    className={styles.tab}
                    id={tabId}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onPointerEnter={event => {
                      if (event.pointerType === 'mouse') setActiveIndex(index);
                    }}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      className={styles.avatar}
                      src={image}
                      alt=""
                      aria-hidden="true"
                      width="56"
                      height="56"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.tabName}>{name}</span>
                  </button>
                  <figure
                    className={styles.panelContent}
                    id={panelId}
                    role="region"
                    aria-labelledby={tabId}
                    hidden={!isActive}
                  >
                    <figcaption className={styles.authorDetails}>
                      <Text secondary as="p">
                        {role}
                      </Text>
                      {relationship && (
                        <Text secondary as="p" size="s">
                          {relationship}
                        </Text>
                      )}
                      <Text className={styles.date} secondary as="p" size="s">
                        <time dateTime={dateTime}>{date}</time>
                      </Text>
                    </figcaption>
                    <blockquote className={styles.quote}>
                      <span className={styles.quoteMark} aria-hidden="true">
                        “
                      </span>
                      <Text className={styles.quoteText} as="p" size="l">
                        {quote}
                      </Text>
                    </blockquote>
                  </figure>
                </article>
              );
            }
          )}
        </div>
        <Button
          secondary
          className={styles.link}
          icon="linkedin"
          href="https://www.linkedin.com/in/maheshbabu11/details/recommendations/"
        >
          View recommendations on LinkedIn
        </Button>
      </div>
    </Section>
  );
}
