import { TimeCapsule } from '@/components/features/TimeCapsule'
import { FadeIn } from '@/components/animations/FadeIn'
import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'

export const metadata = {
  title: 'Time Capsule',
  description: 'A collection of thoughts and moments captured in time',
}

// ISR: revalidate every 5 minutes for fresh content
export const revalidate = 300

export default function CapsulePage() {
  return (
    <PageTransition>
      <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">
              Time Capsule
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              A collection of thoughts, moments, and reflections captured in time
            </p>
          </div>
        </FadeIn>

        <TimeCapsule />
      </PageWrapper>
    </PageTransition>
  )
}
