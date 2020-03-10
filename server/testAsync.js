function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved2');
      }, 2000);
    });
  }
  
function resolveAfter3Seconds() {
    return new Promise(resolve => {
    setTimeout(() => {
    resolve('resolved3');
    }, 2000);
});
}

async function asyncCall() {
    //console.log('calling');
    const lis = []
    for(let i=0; i<3; i++){
        const result2 = await resolveAfter2Seconds();
        lis.push(result2)
    }
    return(lis)
    // expected output: 'resolved'
}

const a = asyncCall()
a.then(res => console.log(res))
  
asyncCall();