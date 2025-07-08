export default function Email() {
  return (
    <div>
      <input type="radio" name="find" value="email" />
      가입한 이메일로 찾기
      <input type="text" placeholder="가입하신 이메일을 입력해주세요" />
      <input type="radio" name="find" value="phone" />
        가입한 휴대폰으로 찾기
      </input>
      <input type="text" placeholder="가입하신 휴대폰 번호를 입력해주세요" />
      <button>아이디 찾기</button>
    </div>
  );
}
