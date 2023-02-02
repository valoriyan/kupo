export interface KupoTeamUpdateMetrics {
  countOfNewUsersInPastDay: number;
  countOfNewUsersInPastWeek: number;
  percentChangeInNewUserSignupsDayOverDay: number;
  percentChangeInNewUserSignupsWeekOverWeek: number;
}

function formatPercentChange(percentChange: number) {
  if (percentChange < 0) {
    return `<span class="bad" style="color: red">↓ ${percentChange.toFixed(2)}%</span>`;
  } else if (percentChange > 25) {
    return `<span class="good" style="color: green">↑ ${percentChange.toFixed(
      2,
    )}%</span>`;
  } else {
    return `<span class="okay" style="color: black">↑ ${percentChange.toFixed(
      2,
    )}%</span>`;
  }
}

export async function generateKupoTeamUpdateEmailHtml({
  name,
  kupoTeamUpdateMetrics,
}: {
  name: string;
  kupoTeamUpdateMetrics: KupoTeamUpdateMetrics;
}): Promise<string> {
  // const otterImageUrls = [
  //   "https://i0.wp.com/multiplier.org/wp-content/uploads/2017/09/Depositphotos_37611461_xl-2015.jpg?w=3000&ssl=1",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04ab9720e95_nrh43dai3hfy__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/B3FOw1CFPEu-png__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04afcd35319_LgiKocvkAdyDSy39qro3DPBJoLH5kzUqILfQ-53zoCI__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04aa216b89f_5n8HL1dwsvV9SWfkxzqO5enZeIcb9UbFEZw0ZFVONg4__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/427351976389521408-png__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/otter2-5e04b3cd43596__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/cute-baby-sea-otters-36-5e05c4b345ef3__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/B2KybtIpVHj-png__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04adb9ca90b_b65d5k5xvd2y-png__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04acb6c3639_nxqr111ddqw11__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/otter-5e04af63d9ec7__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04b784657bf_EFMZ5cGx58It3l8xJdRYLhPmPErL1uOeVwWT19xnfMs__700.jpg",
  //   "https://www.boredpanda.com/blog/wp-content/uploads/2019/12/5e04abc6f2091_x7m7kvexkpr01__700.jpg",
  //   "https://home.adelphi.edu/~ap21473/Cute%20otter.jpg",
  //   "https://cdn.shopify.com/s/files/1/0996/1022/articles/sea-otters-incredibly-cute-incredibly-important4ocean.jpg?v=1625584393",
  //   "https://cdn.shopify.com/s/files/1/0996/1022/files/GettyImages-989597636_SeaOtter-2_grande.jpg?v=1567695677",
  //   "https://cdn.shopify.com/s/files/1/0996/1022/files/GettyImages-93455048_SeaOtter_grande.jpg?v=1567695868",
  //   "https://d3ftabzjnxfdg6.cloudfront.net/app/uploads/2020/05/18-10-28_0002-sea-otter-BB-web-2048x1024.jpg",
  //   "https://d3ftabzjnxfdg6.cloudfront.net/app/uploads/2020/05/20-03-08-w4w-pm-DSC_2930-2-SRS-web-2048x1024.jpg",
  //   "https://d3ftabzjnxfdg6.cloudfront.net/app/uploads/2020/05/Monterey-mom-and-pup-VS-web-2048x1024.jpg",
  //   "https://d3ftabzjnxfdg6.cloudfront.net/app/uploads/2020/05/18-09-26-Ollie-KL-copy-web-2048x1024.jpg",
  //   "https://imagesvc.meredithcorp.io/v3/jumpstartpure/image?url=https://cf-images.us-east-1.prod.boltdns.net/v1/static/6157254766001/1bc35975-380e-47e9-a288-9bd545243fd7/bcacbd7d-0597-4525-82ec-9353eaa1d483/1280x720/match/image.jpg&w=640&h=360&q=90&c=cc",
  //   "https://imgs.search.brave.com/mw742ZX449nCm51eIb5eSNM1wVm1Wlv0sBUf2u3i4Nc/rs:fit:480:270:1/g:ce/aHR0cHM6Ly9tZWRp/YS5naXBoeS5jb20v/bWVkaWEvZDMxdVky/VWd6ekNyMmNFMC9n/aXBoeS5naWY.gif",
  //   "https://imgs.search.brave.com/DYaIckp4zktg0yjouCLsY0JBBcCevVaLO3FuCExl4Ns/rs:fit:510:383:1/g:ce/aHR0cHM6Ly9jZG4u/cXVvdGVzZ3JhbS5j/b20vaW1nLzQyLzE1/LzE5NjcxMDA4Njkt/c291dGgtcGFyay1v/dHRlci1tZW1lLWdl/bmVyYXRvci1ob3ct/cmVhc29uYWJsZS1p/cy1pdC10by1lYXQt/b2ZmLXdvb2QtaW5z/dGVhZC1vZi15b3Vy/LXR1bW15LWE4ZmZj/ZC5qcGc",
  //   "https://imgs.search.brave.com/H7PG-H-BjHo1dt-7ofxxHAlG9LKqAcTy52aM0t96fMY/rs:fit:480:270:1/g:ce/aHR0cHM6Ly9tZWRp/YTEuZ2lwaHkuY29t/L21lZGlhL2wyU3Fk/ckJyZnFzYWtNeXdV/L3NvdXJjZS5naWY.gif",
  //   "https://imgs.search.brave.com/8jpmeMkBS86P7ua3n5nBBFyfPltckJ1CdcS3Gwj3J3E/rs:fit:480:270:1/g:ce/aHR0cHM6Ly9tZWRp/YTIuZ2lwaHkuY29t/L21lZGlhLzI2dWYw/NWtOaUdBYmhURExh/L3NvdXJjZS5naWY.gif",
  //   "https://imgs.search.brave.com/0Mc3voGarRVVF_whSXndpEX8Xb-GUF3O86fYL7NC6zo/rs:fit:480:270:1/g:ce/aHR0cHM6Ly9tZWRp/YS5naXBoeS5jb20v/bWVkaWEvZDMxeGdw/V2ZqM1BRZEJiYS9n/aXBoeS5naWY.gif",
  // ];

  // const selectedOtterImageUrl =
  //   otterImageUrls[Math.floor(Math.random() * otterImageUrls.length)];

  // const image = await axios.get(selectedOtterImageUrl, {
  //   responseType: "arraybuffer",
  // });
  // const base64Image = Buffer.from(image.data, "binary").toString("base64");

  // console.log(base64Image);
  // // <img src="data:image/jpg;base64, ${base64Image}" />

  return `
    <!doctype html>
    <html>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

      <title>Team Update Email</title>
      <style>
        .good {
          color: green;
        }

        .bad {
          color: red;
        }

        .okay {
          color: black;
        }
      </style>


      <br/>
      Hello ${name}. Kupo Otter here.
      <br/>
      <br/>
      <b>${
        kupoTeamUpdateMetrics.countOfNewUsersInPastDay
      }</b> users (${formatPercentChange(
    kupoTeamUpdateMetrics.percentChangeInNewUserSignupsDayOverDay,
  )}) signed up in the past day.
      <b>${
        kupoTeamUpdateMetrics.countOfNewUsersInPastWeek
      }</b> users  (${formatPercentChange(
    kupoTeamUpdateMetrics.percentChangeInNewUserSignupsWeekOverWeek,
  )}) signed up in the past week.      

    </html>
  `;
}
