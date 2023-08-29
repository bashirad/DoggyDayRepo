import { Link } from "react-router-dom";
import { User } from "../clients/DoggyDayApi";

export interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">UserID</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Activity</th>
              <th scope="col">StartDate</th>
              <th scope="col">EndDate</th>
              <th scope="col">ActivePeriod</th>
              <th scope="col">Group</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => {
              return (
                <tr>
                  <td> {member.userNo}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>{member.activity}</td>
                  <td>{member.startDate}</td>
                  <td>{member.endDate}</td>
                  <td>{member.activePeriod}</td>
                  <td>{member.groups}</td>
                  <td>
                    <Link to={`users/${member.id}`}>manage</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
