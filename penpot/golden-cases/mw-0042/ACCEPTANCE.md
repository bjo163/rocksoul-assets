# MW-0042 — Golden Case Acceptance Criteria

## Integrity
- [ ] STORY, EVENT, PERSON, RGBL are visibly separate records.
- [ ] AWS is downstream of correlation, not a fifth record.
- [ ] PERSON remains visibly partial.
- [ ] Correlation score never appears without dimension/explanation context.
- [ ] `unresolved` is a valid final state.
- [ ] Community submission never appears as canonical evidence before review.
- [ ] Synthetic legal instruments are explicitly labeled fixture/reference-only.
- [ ] Legal analysis is not presented as a court judgment.

## Public web
- [ ] Visitor can understand the case without login.
- [ ] Visitor can inspect provenance for each record.
- [ ] Visitor can navigate Overview → Evidence → Correlation → AWS.
- [ ] Tone stays Gen Z/grunge but broadly readable.
- [ ] No forced slang.
- [ ] No fake certainty.

## Community
- [ ] Member can follow and save.
- [ ] Member can ask a question.
- [ ] Member can submit context.
- [ ] Submission starts as unverified/needs-context.
- [ ] Moderation state is visible.

## Platform
- [ ] Researcher can see canonical blockers.
- [ ] Repository health shows all five domain repos.
- [ ] Degraded PERSON repo state is visible.
- [ ] Reviewer can request context.
- [ ] Reviewer can keep the case unresolved.
- [ ] Reviewer actions map to future audit events.

## Accessibility
- [ ] Keyboard path covers every interactive control.
- [ ] Graph has text equivalent.
- [ ] Focus state is visible.
- [ ] Status is not color-only.
- [ ] 44×44 minimum touch targets.
- [ ] Reduced-motion version remains understandable.

## Responsive proof
- [ ] 1440 desktop complete
- [ ] 768 tablet complete
- [ ] 390 mobile complete
- [ ] No essential provenance/status disappears on small screens

## Exit gate
Only after all items pass may MW-0042 become the reference implementation for:

    packages/tokens
    packages/ui
    apps/web
    apps/community
    apps/platform