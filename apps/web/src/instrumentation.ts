// 서버 부팅 시 Skill 등록 store를 비운다 → 재시작하면 등록 제품이 사라진다.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { clearRegisteredStore } = await import("./server/registered-store");
    clearRegisteredStore();
  }
}
