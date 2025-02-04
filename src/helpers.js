export async function pauseWhileTrue(expression) {
  while (expression) {
    console.log('expression', expression)
    await new Promise((r) => setTimeout(r, 100));
  }
}