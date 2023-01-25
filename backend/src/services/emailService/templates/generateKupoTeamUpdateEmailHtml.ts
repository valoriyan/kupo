export function generateKupoTeamUpdateEmailHtml({
  name,
  countOfNewUsersInPastDay,
  countOfNewUsersInPastWeek,
}: {
  name: string;
  countOfNewUsersInPastDay: number;
  countOfNewUsersInPastWeek: number;
}) {
  return `
    <html>
      <br/>
      Hello ${name}. Kupo Otter here.
      <br/>
      <br/>
      <b>${countOfNewUsersInPastDay}</b> users signed up in the past day.
      <b>${countOfNewUsersInPastWeek}</b> users signed up in the past week.
    </html>
  `;
}
