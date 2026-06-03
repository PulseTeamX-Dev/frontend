export const InviteUserModal = () => {
  return (
    <div className="p-4">
      <h2>Invite user</h2>

      <input placeholder="email" />

      <select>
        <option value="hr">HR</option>
        <option value="team_lead">Team Lead</option>
      </select>

      <button>Send invite</button>
    </div>
  );
};